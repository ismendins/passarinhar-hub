const supabase = require('../supabase');

class User {
    constructor(id, email, senha, nome, telefone, data_nascimento, tipo ){
        this.id = id;
        this.email = email;
        this.senha = senha;
        this.nome = nome;
        this.telefone = telefone;
        this.data_nascimento = data_nascimento;
        this.tipo = tipo;
    }
}

module.exports = User;