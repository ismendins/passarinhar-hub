const cliente = require('../config/db');

exports.exibirMapa = (req, res) => {
  res.render('index.ejs');
};

exports.getAllFarms = async (req, res) => {
    try {
        let { data } = await cliente.supabase.from('fazenda').select('*');
        res.send(data);
    } catch(error) {
        console.error(error);
    }
}

exports.getOneFarm = async (req, res) => {
    try {
        let { data } = await cliente.supabase.from('fazenda').select('*').eq('id', req.params.id);
        res.send(data);
    } catch(error) {
        console.error(error);
    }
}

exports.postNewFarm = async (req, res) => {
    try {
        if (!req.body) {
        return res.status(400).json({ error: 'Informe os dados obrigatórios' });
    }
      
      const {
        nome,
        descricao,
        area_total,
        latitude,
        longitude,
        visitas_permitidas,
        visita_agendamento,
        ativa,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'Nome da localidade é obrigatório' });
      }
      
      if (!logradouro || !area_total || !estado) {
        return res.status(400).json({ error: 'Certos dados de endereço são obrigatórios' });
    }

    const { data: enderecoData, error: enderecoError } = await cliente.supabase
    .from('endereco')
    .insert([
      {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      }
    ])
    .select();

    if (enderecoError) {
        console.error('Erro ao criar endereço:', enderecoError);
        return res.status(400).json({ error: enderecoError.message });
    }
  
      const endereco_id = enderecoData[0].id;

      const { data: fazendaData, error: fazendaError } = await cliente.supabase
      .from('fazenda')
      .insert([
        {
          nome,
          descricao,
          area_total,
          latitude,
          longitude,
          endereco_id,
          visitas_permitidas: visitas_permitidas || false,
          visita_agendamento: visita_agendamento || false,
          ativa: ativa !== undefined ? ativa : true
        }
      ])
      .select();

    if (fazendaError) {
      await cliente.supabase
        .from('endereco')
        .delete()
        .eq('id', endereco_id);

      console.error('Erro ao criar fazenda:', fazendaError);
      return res.status(400).json({ error: fazendaError.message });
    }

    const result = {
      ...fazendaData[0],
      endereco: enderecoData[0]
    };

    return res.status(201).json(result);
    } catch (error) {
        console.error('Erro interno ao criar fazenda:', error);
        return res.status(500).json({ error: error.message || 'Erro interno do servidor' });    
    }
  }

exports.deleteFarm = async (req, res) => {
    try {
    const farmId = req.params.id;

    const { data: fazenda, error: fazendaError } = await cliente.supabase
      .from('fazenda')
      .select('*')
      .eq('id', farmId)
      .single();

    const enderecoId = fazenda.endereco_id;

    const { data, error } = await cliente.supabase.from('fazenda').delete().eq('id', farmId);

    if (enderecoId) {
        const { error } = await cliente.supabase
          .from('endereco')
          .delete()
          .eq('id', enderecoId);
    }
    return res.status(204).send();
    } catch (error) {
        console.error('Error deleting farm', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}