class BasePost {
    constructor() {}
  
    createPost(req, res) {
      this.validatePostData(req, res);
    }
  
    validatePostData(req, res) {
      // Validation logic here
    }
  
    savePostToDb(req, res) {
      // Save logic here
    }
  
    rerouteToBlog() {
      // Notification logic here
    }
  }
  module.exports = BasePost