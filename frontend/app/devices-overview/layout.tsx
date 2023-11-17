import LayoutHeader from '../components/layout-header/layout-header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<LayoutHeader/>
			{children}
		</div>
	)
}
