import InvitacionLanding from '@/components/InvitacionLanding';

export default function InvitacionPage({ params }: { params: { invitador: string } }) {
  return <InvitacionLanding invitadorSlug={params.invitador} />;
}
