import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql-client";
import { gql } from "graphql-request";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      completed
      createdAt
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
      createdAt
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      text
      completed
      createdAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const { todos } = await graphqlClient.request<{ todos: Todo[] }>(
        GET_TODOS,
      );
      return todos;
    },
  });
}

export function useAddTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const { addTodo } = await graphqlClient.request<{ addTodo: Todo }>(
        ADD_TODO,
        {
          text,
        },
      )   },


      onMutate: async(text: string) =>{
        await queryClient.cancelQueries({queryKey: ['todos']});
        const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

        const optimisticTodo: Todo = {
           id: 'temp-' + Date.now(),
           text,
           completed: false,
           createdAt: new Date().toISOString()
        };

        queryClient.setQueryData(['todos'], (old:Todo[] = []) => [optimisticTodo, ...old]);

        return {previousTodos};
      },


      onError: (err, text, context) => {
         if(context?.previousTodos){
          queryClient.setQueryData(['todos'],(old:Todo[]= []) => [...old]);
         }
      },

      onSettled: ()=> {
        queryClient.invalidateQueries({queryKey: ['todos']});
      }
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { toggleTodo } = await graphqlClient.request<{ toggleTodo: Todo }>(
        TOGGLE_TODO,
        { id },
      );
      return toggleTodo;
    },
    
    onMutate: async(id: string) => {
      queryClient.cancelQueries({queryKey: ['todos']});

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      
      queryClient.setQueryData(['todos'], (old:Todo[]=[]) => {
        old.map((todo) => {
          if(todo.id === id)
            return {...todo, completed: !todo.completed};
          return todo;
        })
        
      });

      return {previousTodos};
    },
    onError: (err, id , context) => {
       if(context?.previousTodos)
        queryClient.setQueryData(['todos'] , context.previousTodos);
    },

    onSettled: async() =>{
      queryClient.invalidateQueries({queryKey: ['todos']});
    }
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await graphqlClient.request(DELETE_TODO, { id });
    },
    onMutate: async (id: string) => {
      queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData(["todos"], (old: Todo[] = []) => {
        old.filter((todo) => {
          if (todo.id !== id) return todo;
        });
      });

      return { previousTodos };
    },
    onError: (err, id, context) => {
      if (context?.previousTodos)
        queryClient.setQueryData(["todos"], context.previousTodos);
    },

    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}