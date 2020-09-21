import API from "../utils/API";

class ItemService {

    async addItem(itemToAdd) {
        return await API.post(`items/`, itemToAdd);
    }
    async updateItemById(item) {
        return await API.put(`items/${item._id}`, item);
    }
    async deleteItemById(itemId) {
        return await API.delete(`items/${itemId}`);
    }
    async updateCheckOrUncheckItem(message) {
        return await API.put(`items/${message._id}`, message);
    }
    async getItemsById(id) {
        return await API.get(`items/${id}`);
    }
    async addBulkItems(userId, listId, bulkItems) {
        return await API.post(`items/saveBulkItems/${userId}/${listId}`, bulkItems);
    }
    async duplicateItemOrItem(userId, listId, bulkItems) {
        return await API.post(`items/saveBulkItems/${userId}/${listId}`, bulkItems);
    }
    async deleteBulkItemsById(listId) {
        return await API.delete(`items/deleteBulkItems/${listId}`);
    }
    async updateBulkCheckOrUncheckItems(listId, completedDate) {
        return await API.put(`items/updateBulkItems/${listId}`, { completedDate: completedDate });
    }
    async deleteBulkGroupItemsByAisle(listId, aisleName) {
        return await API.delete(`items/deleteBulkItemsByAisle/${listId}/${aisleName}`);
    }
    async updateBulkGroupItemsByAisle(listId, aisleName, completedDate) {
        return await API.put(`items/updateBulkGroupItems/${listId}/${aisleName}`, { completedDate: completedDate });
    }
    async moveItem(itemId, aisleName) {
        return await API.put(`items/moveItem/${itemId}/${aisleName}`);
    }
    async moveBulkGroupItemsByAisle(aisleName) {
        return await API.put(`items/moveBulkItems/${aisleName}`);
    }

}

export default new ItemService();