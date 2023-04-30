import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {

    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table) {
        return this.#database[table] ?? []
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist()
        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex > -1) {
            const task = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = { id, ...task, ...data }
            this.#persist()
        } else {
            throw new Error("Taks not found in database")
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        } else {
            throw new Error("Taks not found in database")
        }
    }

    patch(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex > -1) {
            const task = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = { id, ...task, ...data }
            this.#persist()
        } else {
            throw new Error("Taks not found in database")
        }
    }

}