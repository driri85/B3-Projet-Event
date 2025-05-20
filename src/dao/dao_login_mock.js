class DAOMock {
    constructor() {
        this.data = [
            { id: '1', email: 'user1@gmail.com', password: '123456', admin: true },
            { id: '2', email: 'user2@gmail.com', password: '123456', admin: true },
            { id: '3', email: 'user3@gmail.com', password: '123456', admin: false },
            { id: '4', email: 'user4@gmail.com', password: '123456', admin: false },
        ];
        this.nextId = 5;
    }

    async findAll() {
        return this.data;
    }

    async findById(id) {
        return this.data.find(item => item.id === id);
    }

    async create(data) {
        const newItem = { id: String(this.nextId++), ...data };
        this.data.push(newItem);
        return newItem;
    }

    async update(id, data) {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.data[index] = { id, ...data };
        return this.data[index];
    }

    async delete(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) return null;

        const deletedItem = this.data.splice(index, 1);
        return deletedItem[0];
    }

    async findByEmail(email) {
        return this.data.find(item => item.email === email);
    }
    async findByAdmin(admin){
        return this.data.find(item => item.admin === admin);
    }
}

module.exports = DAOMock;
