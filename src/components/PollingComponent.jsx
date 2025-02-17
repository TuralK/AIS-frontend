import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchConversationsThunk } from '../thunks/messageThunks';

const PollingComponent = ({ apiUrl }) => {
  const dispatch = useDispatch();
  const [pollInterval, setPollInterval] = useState(60000);
  const prevMessagesRef = useRef([]);
  const pollingTimeoutRef = useRef(null);

  const pollMessages = async () => {
    const resultAction = await dispatch(fetchConversationsThunk(apiUrl));
    if (fetchConversationsThunk.fulfilled.match(resultAction)) {
      const newMessages = resultAction.payload.messages;

      const messagesUnchanged =
        JSON.stringify(prevMessagesRef.current) === JSON.stringify(newMessages);

      if (messagesUnchanged) {
        setPollInterval((prev) => Math.min(prev + 60000, 360000));
      } else {
        setPollInterval(60000);
      }
      prevMessagesRef.current = newMessages;
    }

    // Eski zamanlayıcıyı temizleyip yenisini başlatıyoruz
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    pollingTimeoutRef.current = setTimeout(pollMessages, pollInterval);
  };

  useEffect(() => {
    pollMessages();
    return () => clearTimeout(pollingTimeoutRef.current);
  }, [dispatch, apiUrl]); 

  return null;
};

export default PollingComponent;
