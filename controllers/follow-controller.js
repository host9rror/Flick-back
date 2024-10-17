const { prisma } = require("../prisma/prisma-client");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (followingId === userId) {
      return res.status(500).json({ message: "You cannot follow yourself" });
    }

    try {
      const existingSubscription = await prisma.follows.findFirst({
        where: {
          AND: [
            {
              followerId: userId,
            },
            {
              followingId,
            },
          ],
        },
      });

      if (existingSubscription) {
        return res.status(400).json({ message: "Subscription already exists" });
      }

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });

      res.status(201).json({ message: "Subscription created successfully" });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Server error" });
    }
  },
  unfollowUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    try {
      const follows = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId: followingId }],
        },
      });

      if (!follows) {
        return res.status(404).json({ error: "Record not found" });
      }

      await prisma.follows.delete({
        where: { id: follows.id },
      });

      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = FollowController;
