import { createSchema } from "graphql-yoga";
import { readTodos, writeTodos, generateId, type Todo } from "@/src/lib/db";

export const schema = createSchema({
  typeDefs: `
     type Todo {
       id: ID!
       text: String!
       completed: Boolean!
       createdAt: String!
     }

     type Query {
       todos: [Todo!]!
       todo(id: ID!): Todo
     }

     type Mutation {
        addTodo(text: String!): Todo!
        toggleTodo(id: ID!): Todo!
        deleteTodo(id: ID!): Boolean!
     }
    `,
  resolvers: {
    Query: {
      todos: async () => {
        return await readTodos();
      },
      todo: async (_, { id }) => {
        const todos = await readTodos();
        return todos.find((t: Todo) => t.id === id);
      },
    },

    Mutation: {
      addTodo: async (_, { text }) => {
        const todos = await readTodos();
        const newTodo: Todo = {
          id: generateId(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        todos.unshift(newTodo);
        await writeTodos(todos);
        return newTodo;
      },

      toggleTodo: async (_, { id }) => {
        const todos = await readTodos();
        const todo = todos.find((t: Todo) => t.id === id);
        if (!todo) throw new Error("Todo not found");

        todo.completed = !todo.completed;
        await writeTodos(todos);
        return todo;
      },

      deleteTodo: async (_, {id}) =>{
        const todos = await readTodos();
        const filtered = todos.filter((t: Todo) => t.id !== id);
        await writeTodos(filtered);
        return true;
      }
    },
  },
});
