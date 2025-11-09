'use client'
import {ButtonNav} from '@/Components/Atoms';
import { useRouter } from 'next/navigation';
import styles from './NavBar.module.css'

interface NavItemProps{
    name: string,
    route: string
}

interface NavBarProps{
    navBar: NavItemProps[]
}

export default function NavBar({
    navBar
}:NavBarProps){

    const router=useRouter();
    return(
        <nav className={styles.navBar}>
            {navBar.map(option => (
                <ButtonNav 
                    key={option.route}
                    name={option.name}
                    onClick={() => router.push(option.route)}
                />
            ))}
        </nav>
    );
}