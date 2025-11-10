import {FormProfile} from '@/Components/Organisms'
import UpdateProfile from './UpdateProfile';
import {UserLayout} from '@/Components/Templates'


export default function Profile(){
    return(
        <UserLayout
           pageTitle="Informacion de la cuenta"
           pageSubtitle="jijijajajaj"
        >
            <UpdateProfile/>
        </UserLayout>
    );
}