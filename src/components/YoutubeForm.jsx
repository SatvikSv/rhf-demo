import { React, useEffect } from 'react'

import { useForm, useFieldArray } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

let renderCount = 0;

export const YoutubeForm = () => {

    const form = useForm({
        // defaultValues: async () => {
        //     const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
        //     const data = await response.json()
        //     return {
        //         username: "Batman",
        //         email: data.email,
        //         channel: "",
        //     };
        // },


        defaultValues: {
            username: "Batman",
            email: "",
            channel: "",
            social: {
                twitter: "",
                facebook: "",
            },
            phoneNumbers: ["", ""],
            phNumbers: [{
                number: ""
            }],
            age: 0,
            dob: new Date(),
        },
        mode: "onTouched",
    });
    const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
    const { errors, touchedFields, dirtyFields, isDirty , isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;

    console.log( {isSubmitting});

    console.log({ touchedFields, dirtyFields, isDirty, isValid });

    const { fields, append, remove } = useFieldArray({
        name: 'phNumbers',
        control
    })

    const onSubmit = (data) => {
        console.log('Form submitted', data);
    }

    const onError = (errors) => {
        console.log("Form errors", errors);

    }

    const handleGetValues = () => {
        console.log("Get values", getValues("social"));
    }

    const handleSetValues = () => {
        setValue("social", { twitter: "", facebook: "" }, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    }

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);



    // useEffect(() => {
    //     const subscription = watch((value) => {
    //         console.log(value)
    //     })
    //     return () => subscription.unsubscribe();
    // }, [watch]);

    // const watchUsername = watch(["username", "email"])



    renderCount++
    return (
        <div>
            <h1>Youtube Form ({renderCount / 2})</h1>
            {/* <h2>Watched value: {watchUsername}</h2> */}

            <form onSubmit={handleSubmit(onSubmit,onError)} noValidate>

                <div className='form-control'>

                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' {...register("username", {
                        required: {
                            value: true,
                            message: 'Username is required'
                        }
                    }
                    )} />
                    <p>{errors.username?.message}</p>
                </div>

                <div className='form-control'>

                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' {...register("email", {
                        required: {
                            value: true,
                            message: 'Email is required'
                        },
                        validate: {
                            notAdmin: (fieldValue) => {
                                return (
                                    fieldValue !== "admin@example.com" || "Enter a different email address"
                                );
                            },
                            notBlackListed: (fieldValue) => {
                                return (
                                    !fieldValue.endsWith("baddomain.com") || "This domain is not supported"
                                );
                            },
                            emailAvailable: async (fieldValue) => {
                                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
                                const data = await response.json();
                                return data.length == 0 || "Email already exists"
                            }
                        },
                    })} />
                    <p>{errors.email?.message}</p>
                </div>

                <div className='form-control'>

                    <label htmlFor='channel'>Channel</label>
                    <input type='text' id='channel' {...register("channel", {
                        required: {
                            value: true,
                            message: "Channel is required",
                        },
                    })} />
                    <p>{errors.channel?.message}</p>
                </div>


                <div className='form-control'>

                    <label htmlFor='twitter'>Twitter</label>
                    <input type='text' id='twitter' {...register("social.twitter", {
                        disabled: watch("channel") === "",
                    },
                        {
                            required: {
                                value: true,
                                message: "Twitter is required",
                            }
                        })} />
                    <p>{errors.social?.twitter?.message}</p>
                </div>

                <div className='form-control'>

                    <label htmlFor='facebook'>Facebook</label>
                    <input type='text' id='facebook' {...register("social.facebook", {
                        required: {
                            value: true,
                            message: "Facebook is required",
                        }
                    })} />
                    <p>{errors.social?.facebook?.message}</p>
                </div>

                <div className='form-control'>

                    <label htmlFor='primary-phone'>Primary phone number</label>
                    <input type='text' id='primary-phone' {...register("phoneNumbers.0", {
                        required: {
                            value: true,
                            message: "Primary phone number is required",
                        }
                    })} />
                    <p>{errors.phoneNumbers?.[0]?.message}</p>
                </div>

                <div className='form-control'>

                    <label htmlFor='secondary-phone'>Secondary phone number</label>
                    <input type='text' id='secondary-phone' {...register("phoneNumbers.1")} />
                </div>

                <div>
                    <label>List of phone numbers</label>
                    <div>
                        {
                            fields.map((field, index) => {
                                return (
                                    <div className='form-control' key={field.id}>

                                        <input type="text" {...register(`phNumbers.${index}.number`)} />

                                        {
                                            index > 0 && (
                                                <button type='button' onClick={() => remove(index)}>
                                                    Remove phone number
                                                </button>
                                            )
                                        }
                                    </div>
                                );
                            })
                        }
                        <button type='button' onClick={() => append({ number: "" })}>
                            Add phone number
                        </button>




                    </div>
                </div>

                <div className='form-control'>

                    <label htmlFor='age'>Age</label>
                    <input type='number' id='age' {...register("age", {
                        valueAsNumber: true,
                        required: {
                            value: true,
                            message: "Age is required",
                        },
                    })} />
                    <p>{errors.age?.message}</p>
                </div>

                <div className='form-control'>

                    <label htmlFor='dob'>Date of Birth</label>
                    <input type='date' id='dob' {...register("dob", {
                        valueAsDate: true,
                        required: {
                            value: true,
                            message: "Date of Birth is required",
                        },
                    })} />
                    <p>{errors.dob?.message}</p>
                </div>

                <button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
                <button type='button' onClick={() => reset()}>
                    Reset
                </button>
                <button type='button' onClick={handleGetValues}>
                    Get values
                </button>
                <button type='button' onClick={handleSetValues}>
                    Set values
                </button>
                <button type='button' onClick={() => trigger()}>
                    Validate
                </button>
            </form>
            <DevTool control={control} />
        </div>
    )
}
