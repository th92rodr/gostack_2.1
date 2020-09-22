import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw new Error('Invalid value for transaction type.');
    }

    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();

      if (balance.total - value < 0) {
        throw new Error('Not enough funds to complete transaction.');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
