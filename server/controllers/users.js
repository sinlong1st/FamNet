import User from "../models/User.js";

/* Get */
// User
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get User's friends
export const getuserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // The reason we need to format the friends because
    // Now we have info of friends and even their friends
    // => not neccessary, so we just format it with info that we need
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, picturePath, location }) => {
        return { _id, firstName, lastName, occupation, picturePath, location };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Update */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendID } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendID);
    // So to check the logic here, we need to see if they unfriend or friend at the moment
    // If that friend is in user's friend list, it means the user is trying to remove the friend
    if (user.friends.includes(friendID)) {
      // Now use filter to remove that friend
      user.friends = user.friends.filter((id) => id !== friendID);
      // Also remove the user from their friend list, using also the filter
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // Else, user is adding friend
      user.friends.push(friendID);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    // Format it like we do in get user friends
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // The reason we need to format the friends because
    // Now we have info of friends and even their friends
    // => not neccessary, so we just format it with info that we need
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, picturePath, location }) => {
        return { _id, firstName, lastName, occupation, picturePath, location };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
