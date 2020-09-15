import { serviceLocator } from "../server/service-locator";

const userApplicationService = serviceLocator.getUserApplicationService();
const userRepository = serviceLocator.getUserRepository();
(async () => {
  const usersCount = await userRepository.count();
  if (usersCount == 0) {
    for (let i = 0; i < 5; i++) {
      await userApplicationService.registerUser({
        username: `user${i}`,
        password: `pass${i}`,
      });
      console.log(`Inserted user${i}`);
    }
  }
  else{
    console.log(`New users not inserted`);
  }
})();
