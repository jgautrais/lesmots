import { NavBar } from '@/components/molecules';

function NotFound() {
  return (
    <div className="container mx-auto text-center">
      <NavBar />
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}

export default NotFound;
