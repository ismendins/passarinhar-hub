const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    const { email, senha } = req.body;
    try {
        const { data, error } = await supabase
            .from('usuario')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.render('userLogin', { error: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(senha, data.senha);
        if (!isPasswordValid) {
            return res.render('userLogin', { error: 'Senha incorreta' });
        }

        req.session.user = {
            id: data.id,
            email: data.email,
            nome: data.nome,
            tipo: data.tipo,
        };

        res.redirect('/homepage');
    } catch (err) {
        console.error(err);
        res.render('userLogin', { error: 'Ocorreu um erro. Tente novamente.' });
    }
}

async function register(req, res) {
    const { email, senha, nome, telefone, data_nascimento, tipo } = req.body;
    
    try {
        const { data, error, count } = await supabase
            .from("usuario")
            .select("*", { count: "exact" })
            .eq("email", email);

        if (error) {
            console.error("Erro ao verificar o e-mail:", error.message);
            return res.render("userRegister", {
                error: "Erro ao verificar o e-mail. Tente novamente.",
            });
        }

        console.log("Resultado da busca de e-mail:", data, count);

        if (count > 0) {
            return res.render("userRegister", {
                error: "Este email já está em uso.",
            });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const { data: newUser, error: insertError } = await supabase
            .from("usuario")
            .insert([
                {
                    email,
                    senha: hashedPassword,
                    nome,
                    telefone,
                    data_nascimento,
                    tipo,
                },
            ])
            .select();

        console.log("Novo usuário inserido:", newUser);

        if (insertError) {
            console.error("Erro ao criar o usuário:", insertError.message);
            return res.render("userRegister", {
                error: "Erro ao criar o usuário. Tente novamente.",
            });
        }

        if (newUser && newUser.length > 0 && newUser[0].id) {
            req.session.user = {
                id: newUser[0].id,
                email: newUser[0].email,
                nome: newUser[0].nome,
                tipo: newUser[0].tipo,
            };

            return res.redirect("/users/login");
        } else {
            console.error("Erro inesperado: o usuário criado não contém um ID válido.");
            return res.render("userRegister", {
                error: "Ocorreu um erro ao registrar o usuário. Tente novamente.",
            });
        }
    } catch (error) {
        console.error("Erro inesperado:", error.message);
        res.render("userRegister", {
            error: "Ocorreu um erro ao registrar o usuário. Tente novamente.",
        });
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao realizar logout:', err);
            return res.status(500).send('Erro ao realizar logout');
        }
        res.clearCookie('connect.sid');
        res.redirect('/users/login');
    });
}

module.exports = {
    login,
    register,
    logout,
};