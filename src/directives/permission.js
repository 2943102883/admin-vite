export default function setupPermissionDirective(app) {
	function updateElVisible(el, permission) {
		if (!permission.value && !permission.arg) {
			throw new Error(`need roles: like v-auth:['edit']="[useRoute]"`);
		}
		if (
			permission.value &&
			!permission.value.meta.auth?.includes(permission.arg)
		) {
			el.parentElement?.removeChild(el);
		}
	}

	const permissionDirective = {
		mounted(el, binding) {
			updateElVisible(el, binding);
		},
		beforeUpdate(el, binding) {
			updateElVisible(el, binding);
		},
	};

	app.directive("auth", permissionDirective);
}
