<script>
    import PopoverMenu from '../PopoverMenu.svelte';
    import UserPopupButton from "./Account/UserPopupButton.svelte";
    import router from 'page';
    import { onMount } from "svelte";
    import {User} from '../../stores/UserStore.js';
    import AuthForm from "./Account/AuthForm.svelte";
    import AccountForm from "./Account/AccountForm.svelte";
    import { fetchWithAuth } from "../../serverRequest.js";

    let isSignedIn = false;
    let showPopover = false;

    let isSigningIn = false;
    let isRegistering = false;
    let isManagingAccount = false;

    let popUpInfo = "";

    const goToHomepage = () => {
        router('/');
    }

    const togglePopover = () => {
        showPopover = !showPopover;
        isSigningIn = false;
        isRegistering = false;
        isManagingAccount = false;
        popUpInfo = '';
    };

    const handleSignInButton = () => {
        isSigningIn = true;
    };

    const handleRegisterButton = () => {
        isRegistering = true;
    };

    const handleSignOutButton = async () => {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            return;
        }

        try {
            const { response, data } = await fetchWithAuth(
                'auth/sessions',
                'DELETE',
                authToken,
                null
            );

            if (response.ok) {
                // Clear token
                localStorage.removeItem('authToken');
                // Clear user store
                User.set({});
                isSignedIn = false;
                displayMessagePopUpAndClose('You have been logged out!');
            } else {
                displayMessagePopUp(`Logout failed: ${data.message}`);
            }
        } catch (error) {
            displayMessagePopUp(`Logout failed: ${error}`);
            console.error('Logout error:', error);
        }
    };



    const handleManageAccountButton = () => {
        isManagingAccount = true;
    };

    const cancelForm = () => { isSigningIn = false; isRegistering = false; isManagingAccount = false; };

    const handleSignedIn = () => {
        displayMessagePopUpAndClose("Login successful!");
        isSignedIn = true;
    }

    const handleRegistered = () => {
        displayMessagePopUpAndClose("Registration successful!");
        isSignedIn = true;
    }

    const displayMessagePopUp = (message) => {
        popUpInfo = message;
    }

    const displayMessagePopUpAndClose = (message) => {
        popUpInfo = message;
        setTimeout(() => {
            popUpInfo = '';
            showPopover = false;
        }, 2000);
    }

    onMount(() => {
        isSignedIn = !!localStorage.getItem('authToken');
    });
</script>

<main>
    <span>
        <a href="/">
            <img
                    src="/assets/home.png"
                    alt="home"
                    on:click="{goToHomepage}"
                    on:keydown={goToHomepage}
            />
        </a>
        <UserPopupButton isSignedIn="{isSignedIn}" togglePopover="{togglePopover}"></UserPopupButton>
    </span>

    <PopoverMenu isVisible="{showPopover}" onClose="{togglePopover}">
        {#if popUpInfo.length > 0}
            <h2>{popUpInfo}</h2>
        {:else}
            {#if isSignedIn}
                <div class="popUpAccountMenu">
                    <img
                            class="popUpImage"
                            src="/assets/user.png"
                            alt="Manage account"
                            on:click="{togglePopover}"
                            on:keydown="{togglePopover}"
                    />
                    {#if isManagingAccount}
                        <AccountForm
                                cancelForm="{cancelForm}"
                                on:savedChanges={() => displayMessagePopUpAndClose(`Account updated!`)}
                                on:saveFailed={(event) => displayMessagePopUp(`Update failed: ${event.detail.message}`)}
                        />
                    {:else}
                        <div>
                            <button on:click="{handleSignOutButton}">Log Out</button>
                            <button on:click="{handleManageAccountButton}">Manage Account</button>
                        </div>
                    {/if}
                </div>
            {:else}
                <div>
                    <img
                            class="popUpImage"
                            src="/assets/noUser.png"
                            alt="Sign in/up"
                            on:click="{togglePopover}"
                            on:keydown="{togglePopover}"
                    />
                    {#if !isSigningIn && !isRegistering}
                        <p>Sign In or Register:</p>
                        <button on:click="{handleSignInButton}">Sign In</button>
                        <button on:click="{handleRegisterButton}">Register</button>
                    {/if}
                    {#if isSigningIn || isRegistering}
                        <AuthForm
                                isSigningIn="{isSigningIn}"
                                isRegistering="{isRegistering}"
                                cancelForm="{cancelForm}"
                                on:signedInSuccessfully={handleSignedIn}
                                on:registrationSuccessful={handleRegistered}
                                on:registrationFailed={(event) => displayMessagePopUp(`Registration failed: ${event.detail.message}`)}
                                on:signInFailed={(event) => displayMessagePopUp(`Sign in failed: ${event.detail.message}`)}
                        />
                    {/if}
                </div>
            {/if}
        {/if}
    </PopoverMenu>
</main>

<style>
    span {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 20px;
        position: relative;
    }

    span img {
        height: 3rem;
        width: auto;
        cursor: pointer;
    }

    .popUpImage {
        height: 3rem;
        width: auto;
    }

    .popUpAccountMenu {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
    }

</style>
