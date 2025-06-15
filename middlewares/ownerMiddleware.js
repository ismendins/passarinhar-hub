function requireOwner(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== 'OWNER') {
    return res.status(403).send('Apenas usuários Proprietários podem acessar essa rota.');
  }
  next();
}

module.exports = requireOwner;
