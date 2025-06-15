const cliente = require('../config/db');
const googleMapsClient = require('../config/googleMaps');

exports.getMap = async (req, res) => {
  try {
    const { data, error } = await cliente
    .supabase
    .from('fazenda')
    .select('id, nome, descricao, latitude, longitude, area_total');

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar dados das fazendas' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};