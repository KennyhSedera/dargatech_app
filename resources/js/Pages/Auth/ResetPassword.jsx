import InputError from "@/Components/inputs/InputError";
import InputLabel from "@/Components/inputs/InputLabel";
import PrimaryButton from "@/Components/buttons/PrimaryButton";
import TextInput from "@/Components/inputs/TextInput";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { logo, titre } from "@/constant";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <MainLayout>
            <Head title={"Reset Password"} />
            <div className="z-50 grid w-4/5 grid-cols-1 p-4 rounded-md md:grid-cols-3">
                <div className="flex flex-col items-center justify-center gap-8 md:col-span-2">
                    <div className="flex items-center gap-5">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-16 h-16 transition-transform duration-1000 md:w-20 md:h-20 animate-pulse"
                        />
                        <img
                            src={titre}
                            alt="Titre"
                            className="max-w-[240px] md:max-w-[320px] h-auto"
                        />
                    </div>

                    <div className="space-y-4 text-center">
                        <p className="text-lg text-orange-400 md:text-3xl">
                            Bienvenue sur notre plateforme SISAM
                        </p>
                        <p className="text-xl font-semibold leading-tight text-blue-600 md:text-2xl">
                            Solution d'Irrigation Solaire Améliorée
                        </p>
                        <p className="mt-2 text-base italic text-white md:text-lg">
                            « Avec le soleil, récolter des revenus »
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                        <Head title="Reset Password" />

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full mt-1"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Mot de passe"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full mt-1"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirmer le mot de passe"
                                />

                                <TextInput
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full mt-1"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton
                                    className="ms-4"
                                    disabled={processing}
                                >
                                    Réinitialiser le mot de passe
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
