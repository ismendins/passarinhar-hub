const cliente = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        let { data } = await cliente.supabase.from('usuario').select('*');
        res.send(data);
    } catch(error) {
        console.error(error);
    }
}

exports.getOneUser = async (req, res) => {
    try {
        let { data } = await cliente.supabase.from('usuario').select('*').eq('id', req.params.id);
        res.send(data);
    } catch(error) {
        console.error(error);
    }
}

exports.postNewUser = async (req, res) => {
    try {
        if (!req.body) {
        return res.status(400).json({ error: 'Informe os dados obrigatórios' });
    }
      
      const { email, senha, nome, telefone, data_nascimento, tipo } = req.body;
      
      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
      
      const { data, error } = await cliente.supabase
      .from('usuario')
      .insert([{ email, senha, nome, telefone, data_nascimento, tipo }]);
        
      if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
    } catch (error) {
        console.error('Error creating new user:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

exports.deleteUser = async (req, res) => {
    try {
    const userId = req.params.id;

    const { data, error } = await cliente.supabase.from('usuario').delete().eq('id', userId);
    return res.status(204).send();
    } catch (error) {
        console.error('Error deleting new user:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}