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
        const { email, senha, nome, telefone, data_nascimento, tipo } = req.body;
        const { error, status } = await cliente.supabase.from('usuario').insert([{ email, senha, nome, telefone, data_nascimento, tipo }]);
        res.status(201).json(data);
    } catch (error) {
        console.error(error)
    }
}

exports.deleteUser = async (req, res) => {
    try {
    const userId = req.params.id;

    const { error, status } = await supabase.from('usuario').delete().eq('id', userId);
    return res.status(204).send();
    } catch (error) {
        console.error(error)
    }
}