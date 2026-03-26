import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { apiRequest } from "../../requests/axios_requests";
import { isEmptyStr, isNotEmptyStr, sortBrainstormingEmojis, sortBrainstormingsArray } from "../../helpers/helpers";
import { userFullName } from "../../helpers/library";
import EmojiRow from "./Emojis/EmojiRow";
import ResponseSection from "./Shared/ResponseSection";
import ResponseHeader from "./Shared/ResponseHeader";

const BrainstormingHeader = ({ userName, innovation_topic }) => (
  <ResponseHeader
    userName={userName}
    label='asks about this innovation topic:'
    text={innovation_topic?.innovation_body}
    body={innovation_topic}
    wrapperClass='topic'
  />
);

const BrainstormingItem = ({
  brainstorming,
  emojis,
  user,
  current_user,
  nextTimePeriod,
  innovation_topic,
  itemsArray: brainstormingsArray,
  setItemsArray: setBrainstormingsArray
}) => {
  const [brainstormingBody, setBrainstormingBody] = useState(brainstorming?.brainstorming_body || '')
  const [edit, setEdit] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedEmojiName, setSelectedEmojiName] = useState("");
  const [emojisArr, setEmojisArr] = useState(emojis || []);
  const [emojiObject, setEmojiObject] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const modalRef = useRef(null);

  const sortedEmojisArr = sortBrainstormingEmojis(emojisArr)
  const isCurrentUser = !nextTimePeriod && current_user.email === user.email
  const dataRequest = {
    innovation_brainstorming: {
      brainstorming_body: brainstormingBody || '',
      innovation_topic_id: innovation_topic?.id,
    },
  }

  const dataFromServer = (response) => {
    const updatedBrainstormingBody = response.data.attributes.brainstorming_body
    const updatedData = brainstormingsArray.map(item => {
      if (item.brainstorming.id === brainstorming.id) {
        const updatedBrainstorming = Object.assign({}, item.brainstorming, {
          brainstorming_body: updatedBrainstormingBody,
        });
        return { ...item, brainstorming: updatedBrainstorming };
      }
      return item;
    });
    setBrainstormingsArray(updatedData)
    setEdit(false)
  }

  const updateBrainstormingsArray = (callback) => {
    if (callback.message === 'success') {
      const newBrainstormingsArray = brainstormingsArray.filter(item => item.brainstorming.id !== brainstorming.id)
      setBrainstormingsArray(newBrainstormingsArray)
    }
    setEdit(false)
  }

  const updateBrainstorming = () => {
    const url = '/api/v1/innovation_brainstormings/'
    const id = brainstorming.id
    if (brainstorming.brainstorming_body !== brainstormingBody && isNotEmptyStr(brainstormingBody)) {
      apiRequest("PATCH", dataRequest, dataFromServer, () => {
      }, `${url}${id}`).then();
    } else if (isEmptyStr(brainstormingBody)) {
      apiRequest("DELETE", () => {
      }, updateBrainstormingsArray, () => {
      }, `${url}${id}`).then();
    } else {
      setEdit(false)
    }
  }

  const onCancel = () => {
    setEdit(false)
    setBrainstormingBody(brainstorming.brainstorming_body)
  }

  useEffect(() => {
    if (selectedEmoji) {
      setShowEmojiPicker(false)
      setEmojiObject(Object.assign({}, emojiObject, {
          emoji_code: selectedEmoji,
          emoji_name: selectedEmojiName,
          emojiable_id: brainstorming.id,
          emojiable_type: 'InnovationBrainstorming'
        })
      )
    }

    // Global update brainstormings and sorted them after choice an emoji
    setBrainstormingsArray(prev => {
      const updated = prev.map(item => {
        if (item.brainstorming.id === brainstorming.id) {
          return { ...item, emojis: [...emojisArr] };
        }
        return item;
      });
      return sortBrainstormingsArray(updated);
    });
  }, [selectedEmoji])

  return <div className='row wrap topic brainstorming  mb-1 mw-100'>
    <div className="col-xl-12">
      <div className='d-flex justify-content-end'>
        {isCurrentUser && !edit &&
          <Link to={''} className='text-muted h6 fw-semibold mb-0' onClick={() => setEdit(true)}>Edit</Link>}
      </div>

      {edit &&
        <div className='d-flex justify-content-end'>
          <Link to={''} className='text-danger h6 fw-semibold me-2' onClick={onCancel}>Cancel</Link>
          <Link to={''} className='h6 fw-semibold text-success' disabled onClick={updateBrainstorming}>Save</Link>
        </div>}

      <div className='edit-question fs-7 fs-md-6 w-auto text-start fw-semibold lh-base'>
        {userFullName(user)} suggested:&nbsp;
        <br />
        {edit ?
          <Form.Control as="textarea" rows={4}
                        size="lg"
                        autoFocus={true}
                        onChange={e => setBrainstormingBody(e.target.value)}
                        value={brainstormingBody} />
          : brainstorming.brainstorming_body}
      </div>

      <p className={'text-orange-700 text-end'}>Please vote using emoticons</p>

      <EmojiRow {...{
        emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr: sortedEmojisArr, setEmojisArr, current_user,
        setEmojiObject, showEmojiPicker, setShowEmojiPicker, modalRef,
        isTopicSection: true
      }} />
    </div>
  </div>
}

const TopicSection = ({
  innovation_topic, innovation_brainstormings, nextTimePeriod, isMinUsersResponses,
  setShowWorkingModal, current_user, data, setData
}) => {
  const [brainstormingsArray, setBrainstormingsArray] = useState(innovation_brainstormings || [])
  const userName = userFullName(innovation_topic?.user)

  return (
    <ResponseSection
      nextTimePeriod={nextTimePeriod}
      isMinUsersResponses={isMinUsersResponses}
      items={brainstormingsArray}
      setItems={setBrainstormingsArray}
      current_user={current_user}
      headerComponent={BrainstormingHeader}
      itemComponent={BrainstormingItem}
      headerProps={{ userName, innovation_topic }}
      itemDataKey="brainstorming"
      emptyConfig={{
        stepName: 'innovation-brainstorming',
        defaultTextCurrent: 'No brainstormings yet...!',
        defaultTextNext: 'No Innovation topic for brainstorming this time...!',
        hoverText: 'Suggest this Innovation Topic!',
        nextTimePeriod,
        setShowWorkingModal,
        data,
        setData,
        topicExists: Boolean(innovation_topic),
        emptyClass: 'empty-brainstorming topic',
        previewClass: 'topic'
      }}
    />
  );
};

export default TopicSection
