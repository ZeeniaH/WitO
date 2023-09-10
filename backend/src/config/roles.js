const appRoles = {
  Admin: 'Admin',
  CompanyOwner: 'CompanyOwner',
  BookKeeper: 'BookKeeper',
  Worker: 'Worker',
};

const roles = Object.keys(appRoles);
const roleRights = new Map(Object.entries(appRoles));

module.exports = {
  roles,
  roleRights,
  appRoles,
};
