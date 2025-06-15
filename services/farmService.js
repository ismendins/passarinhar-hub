const cliente = require('../config/db');
const googleMapsClient = require('../config/googleMaps');


async function queryDatabase(table, query = {}) {
    const { data, error } = await cliente.supabase.from(table).select('*').match(query);
    
    if (error) {
        throw new Error(`Erro ao consultar ${table}: ${error.message}`);
    }

    return data;
}

exports.getAllFarms = async (req, res) => {
    try {
        const farms = await queryDatabase('fazenda');
        
        res.send(farms);
    } catch (error) {
        console.error('Erro ao obter as fazendas:', error);
        res.status(500).send({ error: 'Erro interno ao obter as fazendas.' });
    }
};

exports.getOneFarm = async (req, res) => {
    try {
        let { data } = await cliente.supabase.from('fazenda').select('*').eq('id', req.params.id);
        res.send(data);
    } catch(error) {
        console.error(error);
    }
}

exports.getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const geoResponse = await googleMapsClient.reverseGeocode({
            params: {
                latlng: `${latitude},${longitude}`,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        const address = geoResponse.data.results[0]?.formatted_address;
        if (!address) {
            throw new Error('Endereço não encontrado para as coordenadas fornecidas.');
        }

        return address;
    } catch (error) {
        console.error('Erro ao obter o endereço:', error);
        throw new Error('Erro ao obter o endereço a partir das coordenadas.');
    }
};

exports.postNewFarm = async (req, res) => {
  try {
    const {
    owner_id, nome, descricao, area_total, logradouro, numero, complemento, bairro, cidade, estado, cep
    } = req.body;

      console.log("Recebendo os dados do formulário:", req.body);

    const visitas_permitidas = req.body.visitas_permitidas === 'true';
    const visita_agendamento = req.body.visita_agendamento === 'true';
    const ativa = req.body.ativa  === 'true';
        const address = `${logradouro}, ${numero}, ${bairro}, ${cidade} - ${estado}, ${cep}`;

    const geoResponse = await googleMapsClient.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const location = geoResponse.data.results[0]?.geometry?.location;
    if (!location) {
      console.log("Endereço não encontrado.");
      return res.status(404).send({ error: 'Endereço não encontrado.' });
    }

    const { lat, lng } = location;
        console.log("Coordenadas encontradas:", lat, lng);

console.log('Iniciando a inserção no Supabase para o endereço...');    const { data: enderecoData, error: enderecoError } = await cliente.supabase
      .from('endereco')
      .insert([{
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      }])
      .select('id')
      .single();
      console.log('Resposta do Supabase:', enderecoData, enderecoError);


    if (enderecoError) {
      console.error('Erro ao inserir endereço:', enderecoError);
      return res.status(500).send({ error: 'Erro ao salvar endereço.' });
    }
        console.log("Endereço inserido com sucesso:", enderecoData);

    const endereco_id = enderecoData.id;

    const { data: fazendaData, error: fazendaError } = await cliente.supabase
      .from('fazenda')
      .insert([{
        nome,
        descricao,
        area_total,
        latitude: lat,
        endereco_id,
        visitas_permitidas,
        longitude: lng,
        visita_agendamento,
        ativa,
        endereco_id,
      }]);

    if (fazendaError) {
    console.error('Erro ao criar a fazenda:', fazendaError);
  return res.status(500).send({ error: 'Erro ao criar a fazenda.' });
}
        console.log("Fazenda criada com sucesso:", fazendaData);

    res.status(201).redirect('/farms/success');
  } catch (error) {
    console.error('Erro na criação da fazenda:', error);
    res.status(500).send({ error: 'Erro interno do servidor.' });
  }
};

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

exports.getCoordinatesFromAddress = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).send({ error: 'Endereço é obrigatório.' });
    }

    const geoResponse = await googleMapsClient.geocode({
      params: {
        address,
        key: process.env.API_KEY,
      },
    });

    const location = geoResponse.data.results[0]?.geometry?.location;
    if (!location) {
      return res.status(404).send({ error: 'Coordenadas não encontradas para o endereço fornecido.' });
    }

    res.status(200).send(location);
  } catch (error) {
    console.error('Erro ao obter as coordenadas:', error);
    res.status(500).send({ error: 'Erro interno ao obter as coordenadas.' });
  }
};