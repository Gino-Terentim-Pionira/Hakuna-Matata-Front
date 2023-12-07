import api from '../services/api';


async function verifyModuleCooldown(
    userId: string,
    moduleId: string
) {
    const response = await api.post(`/user/cooldown/${userId}`, {
        moduleId
    });

    return response;
}

async function updateModuleCooldown(
    userId: string,
    moduleId: string
) {
    await api.patch(`/user/cooldown/${userId}`, {
        moduleId
    });
}

async function resetAllCooldown(
    userId: string
) {
    await api.patch(`/user/resetCooldown/${userId}`);
}

export { verifyModuleCooldown, updateModuleCooldown, resetAllCooldown };
