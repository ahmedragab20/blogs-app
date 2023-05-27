export default class BlogHandler {
  static update() {
    Debug.log({
      message: '🚀 update blog',
      data: 'update',
    });
  }
  static delete() {
    Debug.log({
      message: '🗑️ Delete blog',
      data: 'delete',
    });
  }
}
