import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import Tiptap from '../Tiptap/Tiptap'

interface ReviewPost {
  reviewPostId: string
  creatorId: string
  _newReviewPost: string
  _newReviewProfessor: string
  _newTaken: string
  _difficulty: number
  _newAnonymous: boolean
}

export default function ReviewEditForm({
  reviewPostId,
  oldReviewPost,
  oldReviewProfessor,
  oldTaken,
  oldDifficulty,
  oldAnonymous,
  onHandleChange,
}) {
  // useSlider hook
  const [slideValue, Slider, setSlide] = useSlider(1, 10, oldDifficulty)

  // default values for reviewPost Object
  const { data: session } = useSession()
  const initialValues: ReviewPost = {
    creatorId: session.user.id,
    reviewPostId: reviewPostId,
    _newReviewPost: oldReviewPost,
    _newReviewProfessor: oldReviewProfessor,
    _newTaken: oldTaken,
    _difficulty: oldDifficulty,
    _newAnonymous: oldAnonymous,
  }

  const sendData = async (newReviewPostData) => {
    const response = await fetch(`/api/reviewposts`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newReviewPostData: newReviewPostData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your review has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.newReviewPostData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: ReviewPost) => {
        let errors: FormikErrors<ReviewPost> = {}
        if (!values._newReviewPost) {
          errors._newReviewPost = 'Required'
        }
        if (!values._newReviewProfessor) {
          errors._newReviewProfessor = 'Required'
        }
        if (!values._newTaken) {
          errors._newTaken = 'Required'
        }
        if (
          values._newReviewPost === oldReviewPost &&
          values._newReviewProfessor === oldReviewProfessor &&
          values._newTaken === oldTaken &&
          values._newAnonymous === oldAnonymous &&
          values._difficulty === oldDifficulty
        ) {
          errors._newReviewPost = 'You made no changes'
          errors._newReviewProfessor = 'You made no changes'
          errors._newTaken = 'You made no changes'
          errors._newAnonymous = 'You made no changes'
          errors._difficulty = 'You made no changes'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        !onHandleChange()
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="_reviewPost">
              <strong>
                Review: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newReviewPost">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="_newReviewPost"
            // Initially, we set it to the old details in initialValues
            oldReviewPost={values._newReviewPost}
          />
          <div className={styles.inputheader}>
            <label htmlFor="_newReviewProfessor">
              <strong>
                Professor: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newReviewProfessor">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_newReviewProfessor"
            placeholder='"Professor Scotty"'
          />
          <div className={styles.inputheader}>
            <label htmlFor="_newTaken">
              <strong>
                Taken: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newTaken">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_newTaken"
            placeholder='"Winter 1907"'
          />
          <div className={styles.inputheader}>
            <label className={styles.check}>
              <Field autoComplete="off" type="checkbox" name="_newAnonymous" />
              <strong>Anonymous?</strong>
            </label>
            <ErrorMessage name="_newAnonymous">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <div className={styles.inputheader}>
            <label htmlFor="_difficulty">
              <strong>Difficulty: {values._difficulty}</strong>
            </label>
            <ErrorMessage name="_newTaken">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Slider />
          <span className={styles.actions}>
            <button
              className={styles.secondary}
              type="submit"
              disabled={isSubmitting}
            >
              Edit Review!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
