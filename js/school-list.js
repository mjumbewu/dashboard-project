const schoolList = document.querySelector('.school-list');

function initializeList(schools) {
  addSchoolsToList(schools);
  return schoolList;
}

function addSchoolsToList(schools) {
  let html = '';
  for (const school of schools) {
    const name = school.name;
    const type = school['Admission Type'];

    const schoolListItemHTML = `
    <li>
      <div class="school-name">${name}</div>
      <div class="school-type">${type}</div>
    </li>
    `;
    html += schoolListItemHTML;
  }
  schoolList.innerHTML = html;
}

export {
  initializeList,
};
