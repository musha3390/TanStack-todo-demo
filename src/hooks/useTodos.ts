import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql-client";
import { gql } from "graphql-request";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  craetedAt: string;
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
  mutation AddTodo {
    addTodo(text: $text) {
      id
      text
      completed
      createdAt
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo {
    toggleTodo(id: $id) {
      id
      text
      compeletd
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
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await graphqlClient.request(DELETE_TODO, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}