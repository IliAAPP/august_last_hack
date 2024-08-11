import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface IProfile {
    _id: string
    email: string
    fullName: string
    phone: string
}

export const useProfile = () => {
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<IProfile>({} as IProfile);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const updatePhoneNumber = async (newPhone: string) => {
        if (profile.docId && newPhone.trim()) {
            await updateDoc(doc(db, 'users', profile.docId), {
                phone: newPhone
            });
            setProfile({ ...profile, phone: newPhone });
        }
    };

    const updateFullName = async (newFullName: string) => {
        if (profile.docId && newFullName.trim()) {
            await updateDoc(doc(db, 'users', profile.docId), {
                fullName: newFullName
            });
            setName(newFullName);
        }
    };

    const updateEmail = async (newEmail: string) => {
        if (profile.docId && newEmail.trim()) {
            await updateDoc(doc(db, 'users', profile.docId), {
                email: newEmail
            });
            setEmail(newEmail);
        }
    };

    useEffect(() => {
        onSnapshot(
            query(collection(db, 'users'), where('_id', '==', user?.uid), limit(1)),
            snapshot => {
                const profile = snapshot.docs.map(d => ({
                    ...(d.data() as Omit<IProfile, 'docId'>),
                    docId: d.id
                }))[0];
                setProfile(profile);
                setName(profile.fullName);
                setPhone(profile.phone);
                setEmail(profile.email);
                setIsLoading(false);
            }
        );
    }, []);

    const value = useMemo(() => ({
        profile, isLoading, name, setName, updateFullName, phone, setPhone, updatePhoneNumber, email, setEmail, updateEmail
    }), [profile, isLoading, name, phone, email]);

    return value;
};
