import { PayloadTokenDTO } from "src/auth/dto/payload-token.dto";
import { UsersController } from "./users.controller"
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateUserDTO } from "./dto/create-user.dto";

describe('Users Controller', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    uploadAvatarImage: jest.fn(),
  }

  beforeEach(() => {
    controller = new UsersController(usersServiceMock as any)
  })

  it('should find One user', async () => {
    const userId = 1;

    await controller.findOneUser(userId)

    expect(usersServiceMock.findOne).toHaveBeenCalledWith(userId)

  })

  it('should create a new user', async () => {
    const createUserDto: CreateUserDTO = {
      name: 'Matheus',
      email: 'teste@teste.com',
      password: '123123'
    }

    const mockUser = {
      id: 1,
      name: 'Matheus',
      email: 'teste@teste.com'
    };

    (usersServiceMock.create).mockResolvedValue(mockUser)

    const result = await controller.createUser(createUserDto)

    expect(usersServiceMock.create).toHaveBeenCalledWith(createUserDto)

    expect(result).toEqual(mockUser)


  })

  it('should update user', async () => {

    const userId = 1;
    const updateUserDto: UpdateUserDTO = {
      name: 'Matheus Novo'
    }
    const tokenPayload: PayloadTokenDTO = {
      sub: userId,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: ''
    }

    const updatedUser = {
      id: userId,
      name: 'Nathan Novo',
      email: 'nathan@nathan.com'
    };

    (usersServiceMock.update as jest.Mock).mockResolvedValue(updatedUser)

    const result = await controller.updateUser(userId, updateUserDto, tokenPayload)

    expect(usersServiceMock.update).toHaveBeenCalledWith(userId, updateUserDto, tokenPayload)

    expect(result).toEqual(updatedUser)

  })


  it('should delete a user', async () => {
    const userId = 1;

    const tokenPayload: PayloadTokenDTO = {
      sub: userId,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: ''
    }

    await controller.deleteUser(userId, tokenPayload)

    expect(usersServiceMock.delete).toHaveBeenCalledWith(userId, tokenPayload)

  })


  it('should upload avatar', async () => {
    const tokenPayload: PayloadTokenDTO = {
      sub: 1,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: ''
    }

    const mockFile = {
      originalname: 'avatar.png',
      mimetype: 'image/png',
      buffer: Buffer.from("mock")
    } as Express.Multer.File;

    await controller.uploadAvatar(tokenPayload, mockFile)

    expect(usersServiceMock.uploadAvatarImage).toHaveBeenCalledWith(tokenPayload, mockFile)

  })

})