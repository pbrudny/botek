async function findUserByUsername(client, username) {
  try {
    const result = await client.users.list();
    return result.members.find(user =>
      user.name === username ||
      user.profile.display_name === username
    );
  } catch (error) {
    console.error("Error looking up user by username:", error);
    throw error;
  }
}

async function findUserByEmail(client, email) {
  try {
    const result = await client.users.lookupByEmail({
      email: email
    });
    return result.user;
  } catch (error) {
    console.error("Error looking up user by email:", error);
    throw error;
  }
}

async function findUser(client, identifier) {
  const isEmail = identifier.includes('@');
  return isEmail
    ? findUserByEmail(client, identifier)
    : findUserByUsername(client, identifier);
}

module.exports = {
  findUser,
  findUserByUsername,
  findUserByEmail
}; 