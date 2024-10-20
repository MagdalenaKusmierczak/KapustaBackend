const getUserData = async (req, res) => {
  const user = req.user;
  return res.json({
    status: "Successful operation",
    code: 200,
    email: user?.email,
    balance: user?.balance,
    transactions: user?.transactions,
  });
};

const updateBalance = async (req, res) => {
  const user = req.user;
  const { newBalance } = req.body;
  user.balance = newBalance;
  await user?.save();
  return res.json({
    status: "Successful operation",
    code: 200,
    newBalance,
  });
};

module.exports = { getUserData, updateBalance };
