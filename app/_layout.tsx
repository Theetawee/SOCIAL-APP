import AuthContextProvider from '@/context/AuthContext';
import useAuth from '@/hooks/Auth/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthStack from '@/components/AuthStack';
import UnAuthStack from '@/components/UnAuthStack';


function RootLayout() {

  const { isAuthenticated} = useAuth();
  console.log(isAuthenticated)
    return (

      <QueryClientProvider client={new QueryClient()}>
        <AuthContextProvider>
          {isAuthenticated ? <AuthStack /> : <UnAuthStack />}
        </AuthContextProvider>
      </QueryClientProvider>
    );

}

export default RootLayout
