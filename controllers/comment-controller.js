const { prisma } = require("../prisma/prisma-client");

const CommentController = {
  createComment: async (req, res) => {
    try {
      const { postId, content } = req.body;
      const userId = req.user.userId;

      if (!postId || !content) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const comment = await prisma.comment.create({
        data: {
          postId,
          userId,
          content,
        },
      });

      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.userId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this comment" });
      }

      await prisma.comment.delete({ where: { id } });

      res.json(comment);
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  },
};

module.exports = CommentController;
