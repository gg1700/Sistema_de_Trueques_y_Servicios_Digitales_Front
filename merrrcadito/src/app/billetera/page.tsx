import WalletView from "@/Components/Templates/WalletView/WalletView";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";

export default function WalletPage() {
    return (
        <AppLayout
            pageTitle="Mi Billetera"
            pageSubtitle="Gestiona tus tokens y transacciones"
        >
            <WalletView />
        </AppLayout>
    );
}
