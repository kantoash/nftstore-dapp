import { useEffect } from 'react'
import { useParams } from 'react-router'
import { getUser } from '../services/ssrblockchain'
import { setUser } from '../store/storeSlices'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import UserInfo from '../components/input/user/UserInfo'
import UserActions from '../components/input/user/UserActions'
import UserContent from '../components/input/user/UserContent'
import Header from '../components/header/Header'

const UserPage = () => {
    const { user } = useSelector((state: RootState) => state.counter)
    const { userAddress } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetch = async () => {
            if (!userAddress) {
                return;
            }
            const user = await getUser(userAddress);
            dispatch(setUser(user));
        }
        fetch();
    },[user])    

  return (
    <div>
        <Header/>
        <UserInfo/>
        <UserActions/>
        <UserContent/>
    </div>
  )
}

export default UserPage