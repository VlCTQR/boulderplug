<script>
    import InputField from "./InputField.svelte";
    import PasswordField from "./PasswordField.svelte";
    import {User} from '../../../stores/UserStore.js';
    import { createEventDispatcher } from 'svelte';
    import {fetchDefault} from "../../../serverRequest.js";

    const dispatch = createEventDispatcher();

    export let isSigningIn;
    export let isRegistering;
    let surname = "";
    let email = "";
    let password = "";
    let repeatPassword = "";
    let errors = {};
    let formError = "";

    export let cancelForm;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
    const nameRegex = /^[a-zA-Z]{2,}$/;

    const validateFields = () => {
        let valid = true;
        formError = "";

        if (isRegistering && !nameRegex.test(surname)) {
            errors.surname = "Surname must be at least 2 characters.";
            valid = false;
        } else {
            errors.surname = "";
        }

        if (!emailRegex.test(email)) {
            errors.email = "Invalid email format.";
            valid = false;
        } else {
            errors.email = "";
        }

        if (!passwordRegex.test(password)) {
            errors.password = "Password must be at least 8 characters, contain one uppercase letter and one special character.";
            valid = false;
        } else {
            errors.password = "";
        }

        if (isRegistering && password !== repeatPassword) {
            errors.repeatPassword = "Passwords do not match.";
            valid = false;
        } else {
            errors.repeatPassword = "";
        }

        if (!valid) {
            formError = "Please fill in all the required fields correctly.";
        }

        return valid;
    };

    // Decoding base64 string
    function base64Decode(str) {
        const padding = '='.repeat((4 - str.length % 4) % 4);
        const base64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    }

    const addUserToStore = () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            const parts = authToken.split('.');
            if (parts.length === 3) {

                //Decoding payload
                const userData = base64Decode(parts[1]);

                if (userData && userData.user) {
                    User.set(userData.user);
                } else {
                    console.error("User data not found in token");
                }
            } else {
                console.error("Invalid token format");
            }
        }
    };

    const handleSignIn = async () => {
        if (email.trim() === "" || password.trim() === "") {
            formError = "Please fill in all the fields.";
            return;
        }

        try {
            const { response, data} = await fetchDefault(
                'auth/sessions',
                'POST',
                {
                    email: email,
                    password: password
                }
            )

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                addUserToStore();
                dispatch("signedInSuccessfully");

            } else {
                dispatch("signInFailed", {message: data.message});
            }
        } catch (error) {
            dispatch("signInFailed", {message: error});
            console.error('Sign-in error:', error);
        }
    };

    const handleRegister = async () => {
        if (validateFields()) {
            try {
                const { response, data} = await fetchDefault(
                    'users',
                    'POST',
                    {
                        name: surname,
                        email: email,
                        password: password
                    }
                )

                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    addUserToStore();
                    dispatch("registrationSuccessful");
                } else {
                    dispatch("registrationFailed", { message: data.error });
                    console.log(data.error);
                }
            } catch (error) {
                dispatch("registrationFailed", { message: error.message });
                console.log(error.message)
            }
        }
    };

    const submit = () => isSigningIn ? handleSignIn() : handleRegister();
</script>

<div class="auth-form">
    {#if formError}
        <div class="error-message">{formError}</div>
    {/if}

    {#if isRegistering}
        <InputField label="Surname" bind:value={surname} error={errors.surname} />
    {/if}

    <InputField label="Email" bind:value={email} error={errors.email} />
    <PasswordField bind:value={password} error={errors.password} label="Password" />

    {#if isRegistering}
        <PasswordField bind:value={repeatPassword} error={errors.repeatPassword} label="Repeat password" />
    {/if}

    <div>
        <button on:click={submit}>{isSigningIn ? 'Sign In' : 'Register'}</button>
        <button class="cancel-btn" on:click={cancelForm}>Cancel</button>
    </div>
</div>


<style>
    .cancel-btn:hover {
        background-color: var(--disabled-color);
        border-color: var(--disabled-color);
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 10px;
    }

    .error-message {
        color: red;
        margin-bottom: 10px;
    }
</style>
