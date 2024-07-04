const bcrypt = require('bcrypt');
const { queryTable, registerUser, confirmEmail, updateUserPassword, updateUserCentro, verifyPassword } = require('../services/userService');
const User = require('../models/User');                                                              
const Centro = require('../models/Centro');
const { sendConfirmationEmail,sendResetEmail , sendNewPasswordEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  const { name, email, password, photoUrl } = req.body;
  try {
    const result = await registerUser(name, email, password, photoUrl);
    if (result.success === false && result.reason === 'user_exists') {
      return res.status(400).json({ message: 'Utilizador já existe' });
    }

    if (result.success) {
      res.status(201).json({ message: 'Utilizador registrado com sucesso. Verifique seu e-mail para confirmar.' });
    } else {
      res.status(400).json({ message: 'Falha ao registrar utilizador' });
    }
  } catch (err) {
    console.error('Erro ao registrar utilizador:', err);
    res.status(500).json({ message: `Erro ao registrar utilizador: ${err.message}` });
  }
};

exports.getData = async (req, res) => {
  try {
    const data = await queryTable();
    res.json(data);
  } catch (err) {
    console.error('Erro ao obter dados da tabela:', err);
    res.status(500).json({ message: `Erro ao obter dados da tabela: ${err.message}` });
  }
};

exports.confirmEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const success = await confirmEmail(email, code);
    if (success) {
      res.status(200).json({ message: 'E-mail confirmado com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao confirmar e-mail' });
    }
  } catch (err) {
    console.error('Erro ao confirmar e-mail:', err);
    res.status(500).json({ message: `Erro ao confirmar e-mail: ${err.message}` });
  }
};

exports.updatePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Verificar a senha atual antes de atualizar
    await verifyPassword(userId, currentPassword);

    // Atualizar a senha
    const success = await updateUserPassword(userId, newPassword);

    if (success) {
      res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao atualizar a senha' });
    }
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    res.status(500).json({ message: `Erro ao atualizar a senha: ${error.message}` });
  }
};


exports.updateCentro = async (req, res) => {
  const { userId, centroId } = req.body;
  console.log(`Recebido userId: ${userId}, centroId: ${centroId}`);
  try {
    const success = await updateUserCentro(userId, centroId);
    if (success) {
      res.status(200).json({ message: 'Centro atualizado com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao atualizar centro' });
    }
  } catch (err) {
    console.error('Erro ao atualizar centro:', err);
    res.status(500).json({ message: `Erro ao atualizar centro: ${err.message}` });
  }
};

exports.getUserData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      include: Centro // Se quiser incluir dados do centro associado ao usuário
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(`Erro ao buscar dados do usuário: ${err.message}`);
    res.status(500).json({ message: `Erro ao buscar dados do usuário: ${err.message}` });
  }
};


// Função para gerar um código de 5 dígitos
const generateConfirmationCode = () => {
  return Math.floor(10000 + Math.random() * 90000); // Gera um número aleatório entre 10000 e 99999
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log(`Procurando usuário com email: ${email}`);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`Usuário não encontrado para email: ${email}`);
      return res.status(404).json({ message: 'Email não encontrado' });
    }

    console.log(`Usuário encontrado: ${user.email}`);

    const resetCode = generateConfirmationCode();
    console.log(`Código de confirmação gerado: ${resetCode}`);

    user.confirmationCode = resetCode;
    await user.save();

    console.log(`Código de confirmação salvo para usuário: ${user.email}`);

    await sendResetEmail(email, resetCode);
    console.log(`Email enviado com código de confirmação para: ${email}`);

    res.status(200).json({ message: 'Código de confirmação enviado para o email' });
  } catch (err) {
    console.error('Erro ao processar solicitação de esqueci a senha:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação de esqueci a senha' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, code } = req.body;

  try {
    console.log(`Tentando redefinir senha para o email: ${email} com código: ${code}`);

    // Encontrar o usuário com o email e código de confirmação fornecidos
    const user = await User.findOne({ where: { email, confirmationCode: code } });
    if (!user) {
      console.log(`Código de confirmação inválido para o email: ${email}`);
      return res.status(400).json({ message: 'Código de confirmação inválido' });
    }

    // Gerar nova senha aleatória
    const newPassword = Math.random().toString(36).slice(-8); // Gera uma senha aleatória
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha do usuário
    user.password = hashedPassword;
    user.firstLogin = true; // Marca o usuário como primeiro login
    user.confirmationCode = null; // Limpa o código de confirmação
    await user.save();

    console.log(`Senha redefinida com sucesso para o email: ${email}`);

    // Enviar nova senha por email
    await sendNewPasswordEmail(email, newPassword);

    // Responder ao cliente com sucesso
    res.status(200).json({ message: 'Senha redefinida e enviada por email' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
};
