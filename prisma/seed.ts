import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning existing data...');
  
  // Delete all existing data in correct order (due to foreign keys)
  await prisma.transfer.deleteMany({});
  await prisma.idempotencyKey.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.customer.deleteMany({});
  
  console.log('✅ Existing data cleaned');
  console.log('🌱 Creating seed data...');

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: { name: 'Alice Johnson', email: 'alice.johnson@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Bob Smith', email: 'bob.smith@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Charlie Brown', email: 'charlie.brown@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Diana Wilson', email: 'diana.wilson@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Emma Davis', email: 'emma.davis@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Frank Miller', email: 'frank.miller@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Grace Taylor', email: 'grace.taylor@email.com' }
    }),
    prisma.customer.create({
      data: { name: 'Henry Clark', email: 'henry.clark@email.com' }
    })
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // Create accounts for each customer (some with multiple accounts)
  const accounts = [];
  
  // Alice - 2 accounts (checking + savings)
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[0].id, balance: 2500.50 }
    }),
    await prisma.account.create({
      data: { customerId: customers[0].id, balance: 15000.00 }
    })
  );

  // Bob - 1 account
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[1].id, balance: 3750.25 }
    })
  );

  // Charlie - 3 accounts (checking, savings, business)
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[2].id, balance: 1200.75 }
    }),
    await prisma.account.create({
      data: { customerId: customers[2].id, balance: 8500.00 }
    }),
    await prisma.account.create({
      data: { customerId: customers[2].id, balance: 12400.50 }
    })
  );

  // Diana - 1 account
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[3].id, balance: 5800.30 }
    })
  );

  // Emma - 3 accounts (checking, savings, investment)
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[4].id, balance: 950.80 }
    }),
    await prisma.account.create({
      data: { customerId: customers[4].id, balance: 12000.00 }
    }),
    await prisma.account.create({
      data: { customerId: customers[4].id, balance: 25000.00 }
    })
  );

  // Frank - 2 accounts
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[5].id, balance: 4200.90 }
    }),
    await prisma.account.create({
      data: { customerId: customers[5].id, balance: 7800.75 }
    })
  );

  // Grace - 1 account
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[6].id, balance: 3200.45 }
    })
  );

  // Henry - 2 accounts
  accounts.push(
    await prisma.account.create({
      data: { customerId: customers[7].id, balance: 6500.00 }
    }),
    await prisma.account.create({
      data: { customerId: customers[7].id, balance: 18000.25 }
    })
  );

  console.log(`✅ Created ${accounts.length} accounts`);

  // Create realistic transfers
  const transfers = [];

  // Alice sends money to Bob
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[0].id, // Alice checking account
        toAccount: accounts[2].id,   // Bob
        amount: 250.00
      }
    })
  );

  // Bob sends to Charlie
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[2].id, // Bob
        toAccount: accounts[3].id,   // Charlie checking
        amount: 150.50
      }
    })
  );

  // Emma transfers between her own accounts
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[7].id, // Emma checking
        toAccount: accounts[8].id,   // Emma savings
        amount: 500.00
      }
    })
  );

  // Diana sends to Frank
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[6].id, // Diana
        toAccount: accounts[10].id,  // Frank account 1
        amount: 800.00
      }
    })
  );

  // Charlie transfers from savings to checking
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[4].id, // Charlie savings
        toAccount: accounts[3].id,   // Charlie checking
        amount: 300.25
      }
    })
  );

  // Alice transfers from savings to Bob
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[1].id, // Alice savings
        toAccount: accounts[2].id,   // Bob
        amount: 1000.00
      }
    })
  );

  // Emma invests from savings
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[8].id, // Emma savings
        toAccount: accounts[9].id,   // Emma investment
        amount: 2000.00
      }
    })
  );

  // Grace sends to Henry
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[12].id, // Grace
        toAccount: accounts[13].id,   // Henry checking
        amount: 425.75
      }
    })
  );

  // Frank transfers between his accounts
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[11].id, // Frank account 2
        toAccount: accounts[10].id,   // Frank account 1
        amount: 600.00
      }
    })
  );

  // Henry sends to Charlie's business account
  transfers.push(
    await prisma.transfer.create({
      data: {
        fromAccount: accounts[14].id, // Henry savings
        toAccount: accounts[5].id,    // Charlie business
        amount: 1200.00
      }
    })
  );

  console.log(`✅ Created ${transfers.length} transfers`);

  // Update account balances after transfers
  console.log('💰 Updating account balances...');
  
  // Recalculate balances based on transfers
  for (const account of accounts) {
    const outgoingTransfers = await prisma.transfer.aggregate({
      where: { fromAccount: account.id },
      _sum: { amount: true }
    });
    
    const incomingTransfers = await prisma.transfer.aggregate({
      where: { toAccount: account.id },
      _sum: { amount: true }
    });

    const outgoing = outgoingTransfers._sum.amount ? Number(outgoingTransfers._sum.amount) : 0;
    const incoming = incomingTransfers._sum.amount ? Number(incomingTransfers._sum.amount) : 0;
    
    // Get initial balance
    const currentAccount = await prisma.account.findUnique({
      where: { id: account.id }
    });
    
    if (currentAccount) {
      const initialBalance = Number(currentAccount.balance);
      const newBalance = initialBalance - outgoing + incoming;
      
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: newBalance }
      });
    }
  }

  console.log('✅ Account balances updated');

  // Display summary of created data
  const totalCustomers = await prisma.customer.count();
  const totalAccounts = await prisma.account.count();
  const totalTransfers = await prisma.transfer.count();
  const totalAmount = await prisma.transfer.aggregate({
    _sum: { amount: true }
  });

  console.log('\n📊 Seed Summary:');
  console.log(`   👥 Customers: ${totalCustomers}`);
  console.log(`   🏦 Accounts: ${totalAccounts}`);
  console.log(`   💸 Transfers: ${totalTransfers}`);
  console.log(`   💰 Total transferred: $${totalAmount._sum.amount?.toFixed(2) || '0.00'}`);
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
