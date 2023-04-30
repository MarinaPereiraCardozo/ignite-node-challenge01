import { buildRoutePath } from "../utils/build-route-path.js";
import { Database } from "./database.js";
import { randomUUID } from 'node:crypto'

const database = new Database

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const users = database.select('tasks')
            return res.end(JSON.stringify(users));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Title is required!' }),
                )
            }
            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Description is required!' })
                )
            }
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
            }
            database.insert('tasks', task)
            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Title is required!' }),
                )
            }
            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Description is required!' })
                )
            }
            try {
                database.update('tasks', id, {
                    title,
                    description,
                    updated_at: new Date()
                })
                return res.writeHead(204).end()
            } catch (err) {
                return res.writeHead(400).end(JSON.stringify(err.message))
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            try {
                database.delete('tasks', id)
                return res.writeHead(204).end()
            } catch (err) {
                return res.writeHead(400).end(JSON.stringify(err.message))
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            try {
                database.patch('tasks', id, {
                    updated_at: new Date(),
                    completed_at: new Date()
                })
                return res.writeHead(204).end()
            } catch (err) {
                return res.writeHead(400).end(JSON.stringify(err.message))
            }
        }
    }
]