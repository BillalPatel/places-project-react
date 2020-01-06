import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../../shared/components/FormElements/input/Input';
import Button from '../../../shared/components/FormElements/button/Button';
import { useForm } from '../../../shared/hooks/form';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../../shared/utils/validators';
import { AuthenticationContext } from '../../../shared/context/authentication-context';
import '../AddNewPlace/PlaceForm.css';
import LoadingSpinner from '../../../shared/components/UIElements/loadingSpinner/LoadingSpinner';

const EditPlace = () => {
  const auth = useContext(AuthenticationContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const { placeId } = useParams();
  const history = useHistory();

  const [formState, inputChange, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
        setLoadedPlace(responseData.place);
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true
          },
          description: {
            value: responseData.place.description,
            isValid: true
          }
        },
        true);
      } catch (error) {}
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  const submitEditNewPlace = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // Replace with backend
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!formState.inputs.title.value) {
    return (
      <div className="center">
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={submitEditNewPlace}>
      <h2>Edit Place</h2>
      <Input
        id="title"
        elementType="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Please enter a valid title"
        onInput={inputChange}
        initialValue={formState.inputs.title.value}
        initiallyValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        elementType="textarea"
        label="Description"
        rows="2"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorMessage="Please enter a valid description"
        onInput={inputChange}
        initialValue={formState.inputs.description.value}
        initiallyValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
          Edit Place
      </Button>
    </form>
  );
};

export default EditPlace;
