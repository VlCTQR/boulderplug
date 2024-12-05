<script>
import InputField from "./InputField.svelte";
import {User} from "../../../stores/UserStore.js";
import { createEventDispatcher } from 'svelte';
import {fetchWithAuth} from "../../../serverRequest.js";

const dispatch = createEventDispatcher();

let name = $User.name;
let email = $User.email;

let errors = {};

export let cancelForm;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z]{2,}$/;

const validateFields = () => {
    let valid = true;
    errors = {};

    if (!nameRegex.test(name)) {
        errors.name = "Name must be at least 2 characters.";
        valid = false;
    } else {
        errors.name = "";
    }

    if (!emailRegex.test(email)) {
        errors.email = "Invalid email format.";
        valid = false;
    } else {
        errors.email = "";
    }

    return valid;
}

const handleSave = async () => {
    if (validateFields()) {
        let requestBody = {};

        if (name !== $User.name) {
            requestBody['name'] = name;
        }

        if (email !== $User.email) {
            requestBody['email'] = email;
        }

        if (Object.keys(requestBody).length > 0) {
            const authToken = localStorage.getItem('authToken');
            try {
                const { response, data } = await fetchWithAuth(
                    'users',
                    'PUT',
                    authToken,
                    requestBody
                );

                if (response.ok) {
                    User.update(user => {
                        return {
                            ...user,
                            name: name,
                            email: email
                        }
                    });
                    localStorage.setItem('authToken', data.token);
                    dispatch("savedChanges");
                    cancelForm();
                } else {
                    dispatch("saveFailed", {message: data.error});
                    console.error(data.error);
                }
            } catch (e) {
                dispatch("saveFailed", {message: e});
                console.error("Error when saving changes: " + e);
            }
        }
    }
}

</script>

<main>
    <p>Change account details:</p>
    <div class="account-form">
        <InputField label="Name" bind:value={name} error={errors.name}/>
        <InputField label="Email" bind:value={email} error={errors.email}/>

        <div>
            <button on:click={handleSave}>Save</button>
            <button class="cancel-btn" on:click={cancelForm}>Cancel</button>
        </div>
    </div>
</main>

<style>
    .cancel-btn:hover {
        background-color: var(--disabled-color);
        border-color: var(--disabled-color);
    }

    .account-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 10px;
    }
</style>