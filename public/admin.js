(async () => {
	let parity = "even";
	const users = await getUsers();
	users.forEach((user) => {
		let deleteButton = user.admin
		? ""
		: `<button class="delete-button" onclick=deleteUser('${user._id}')>❌</button>`;

		let updateButton = user.admin
			? ""
			: `<button class="update-button" onclick=updateUser('${user._id}')>✔️</button>`;

		let usernameInput = user.admin
			? `<input class="user-name" value="${user.user}" disabled></input>`
			: `<input class="user-name" value="${user.user}"></input>`;

		let adminInput = user.admin
			? `<input class="admin-status" value="${user.admin}" disabled></input>`
			: `<input class="admin-status" value="${user.admin}"></input>`;

		let userRow = `
			<div id="userRow-${user._id}" class="user-row ${parity}-row">
				<div class="user-id-cell"><p class="user-id">${user._id.slice(3, 9)}</p></div>
				<div class="user-name-email">${usernameInput}</div>
				<div class="admin-status">${adminInput}</div>
				<div class="user-manage">
					${deleteButton} 
					${updateButton}
				</div>
			</div> `;

		$("#users-container").append(userRow);
		parity = parity == "even" ? "odd" : "even";
	});

	$("#logout-button").click(async (e) => {
		e.preventDefault();
		await fetch("/logout");
		window.location.reload();
	});

	$("#home-button").click(async (e) => {
		e.preventDefault();
		return window.location.href = "/main.html";
	});
})();

async function getUsers() {
  let response = await (
    await fetch(`/getUsers`, {
      method: "GET",
    })
  ).json();
  return response;
};

async function deleteUser(id) {
  let response = await (
    await fetch(`/deleteUser/${id}`, {
      method: "POST",
    })
  ).json();
  if (response) return $(`#userRow-${id}`).remove();
};

async function updateUser(id) {
	const username = $(`#userRow-${id} .user-name`).val();
	const admin = $(`#userRow-${id} .admin-status`).val();

	
}