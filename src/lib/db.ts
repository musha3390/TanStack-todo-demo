import {promises as fs} from "fs"
import path from "path";

const DATA_DIR = path.join(process.cwd(), 'data');
const TODOS_FILE = path.join(DATA_DIR, 'todos.json');

export type Todo = {
    id: string,
    text: string,
    completed: boolean,
    createdAt: string,
};

async function ensureDb() {
    await fs.mkdir(DATA_DIR,{recursive:true});
    try{
        await fs.access(TODOS_FILE);
    }catch {
        await fs.writeFile(TODOS_FILE, JSON.stringify([],null, 2));
    }
}

export async function readTodos(): Promise<Todo[]> {
    await ensureDb();
    const data = await fs.readFile(TODOS_FILE, 'utf-8');
    return JSON.parse(data);
}

export async function writeTodos(todos: Todo[]) {
    await ensureDb();
    await fs.writeFile(TODOS_FILE,JSON.stringify(todos,null,2));
};

export function generateId(): string{
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}