(() => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const isMaster = sessionStorage.getItem('isMaster') === 'true';
  const committeeId = document.body?.dataset?.committeeId;
  const loginUrl = window.location.pathname.includes('/Commitees/') ? '../login.html' : 'login.html';

  if (!committeeId || isMaster) {
    return;
  }

  const permissionMap = {
    it: 'canCommitteeIt',
    marketing: 'canCommitteeMarketing',
    entrepreneurship: 'canCommitteeEntrepreneurship',
    academic: 'canCommitteeAcademic',
    event: 'canCommitteeEvent',
    hr: 'canCommitteeHr',
    law: 'canCommitteeLaw',
    'int-relations': 'canCommitteeIntRelations'
  };

  if (!isLoggedIn) {
    return;
  }

  const permissionKey = permissionMap[committeeId];
  const hasPermission = permissionKey && sessionStorage.getItem(permissionKey) === 'true';
  if (!hasPermission) {
    window.location.href = loginUrl;
  }
})();
