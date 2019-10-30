import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants';

moment.locale('en');


export default function DatePanel({ date, setDate, isEditing = false, width }) {
	const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} disabled={!isEditing}>
                <Text style={{ borderWidth: isEditing ? 1 : 0, padding: 10, width, textAlign: 'center' }}>{date.format(DATE_FORMAT)}</Text>
            </TouchableOpacity>
            {showDatePicker &&
                <DateTimePicker
                    value={date.toDate()}
                    maximumDate={moment().toDate()}
                    onChange={(event, newDate) => {
                        newDate = newDate || date;
                        setShowDatePicker(Platform.OS === 'ios' ? true : false);
                        setDate(moment(newDate));
                    }} />
            }
        </>
    );
}