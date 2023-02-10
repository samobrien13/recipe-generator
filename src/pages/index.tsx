import { FormEvent, useEffect, useState } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const meat = [
  {
    id: 'beefMince',
    name: 'Mince (Beef)',
  },
  {
    id: 'porkMince',
    name: 'Mince (Pork)',
  },
  {
    id: 'steak',
    name: 'Steak',
  },
  {
    id: 'chickenBreast',
    name: 'Chicken (Breast)',
  },
  {
    id: 'chickenThigh',
    name: 'Chicken (Thigh)',
  },
  {
    id: 'chickenWhole',
    name: 'Chicken (Whole)',
  },
];

const vegetables = [
  {
    id: 'broccoli',
    name: 'Broccoli',
  },
  {
    id: 'carrot',
    name: 'Carrot',
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
  },
  {
    id: 'capsicum',
    name: 'Capsicum',
  },
  {
    id: 'potato',
    name: 'Potato',
  },
];

const staples = [
  {
    id: 'rice',
    name: 'Rice',
  },
  {
    id: 'pasta',
    name: 'Pasta',
  },
  {
    id: 'riceNoodles',
    name: 'Rice Noodles',
  },
  {
    id: 'eggNoodles',
    name: 'Egg Noodles',
  },
  {
    id: 'bread',
    name: 'Bread',
  },
  {
    id: 'wraps',
    name: 'Wraps',
  },
];

const sauces = [
  {
    id: 'soy',
    name: 'Soy',
  },
  {
    id: 'gochujang',
    name: 'Gochujang',
  },
  {
    id: 'oyster',
    name: 'Oyster',
  },
  {
    id: 'hoisin',
    name: 'Hoisin',
  },
  {
    id: 'sweetChilli',
    name: 'Sweet Chilli',
  },
  {
    id: 'sriracha',
    name: 'Sriracha',
  },
  {
    id: 'whiteWineVinegar',
    name: 'White Wine Vinegar',
  },
  {
    id: 'appleCiderVinegar',
    name: 'Apple Cider Vinegar',
  },
  {
    id: 'fishSauce',
    name: 'Fish Sauce',
  },
  {
    id: 'sesameOil',
    name: 'Sesame Oil',
  },
];

const dairy = [
  {
    id: 'milk',
    name: 'Milk',
  },
  {
    id: 'cream',
    name: 'Cream',
  },
  {
    id: 'cheddarCheese',
    name: 'Cheese (Cheddar)',
  },
  {
    id: 'yoghurt',
    name: 'Yoghurt (Greek)',
  },
];

const allIngredients = [
  {
    title: 'Meat',
    items: meat,
  },
  {
    title: 'Vegetables',
    items: vegetables,
  },
  {
    title: 'Staples',
    items: staples,
  },
  {
    title: 'Sauces',
    items: sauces,
  },
  {
    title: 'Dairy',
    items: dairy,
  },
];

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useLocalStorage<Array<string>>(
    'input',
    []
  );
  const [apiOutput, setApiOutput] = useLocalStorage('apiOutput', '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const callGenerateEndpoint = async (event: FormEvent<HTMLFormElement>) => {
    setIsGenerating(true);
    event.preventDefault();

    console.log('Calling API with input:', ingredients);

    const apiInput =
      'Generate a recipe using any of the following ingredients: ' +
      ingredients.join(', ');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiInput,
        }),
      });

      const data = await response.json();
      console.log(`API Response: ${JSON.stringify(data)}`);
      if (data.output) {
        const { output } = data;
        console.log(`API: ${output.text}`);

        setApiOutput(`${output.text}`);
      } else if (data.error) {
        console.error(`API Error: ${data.error}`);
        alert(
          'Uh oh... something has gone wrong behind the scenes so please try again later.'
        );
      }
    } catch (err) {
      console.error(`An error occurred: ${err}`);
      alert(
        'Uh oh... something has gone wrong behind the scenes so please try again later.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const formatOutput = (output: string) => {
    return output
      .trim()
      .split('\n')
      .map((item, key) => {
        return <p key={key}>{item}</p>;
      });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    event.target.checked
      ? setIngredients([...ingredients, event.target.value])
      : setIngredients(
          ingredients.filter((ingredient) => ingredient !== event.target.value)
        );

    console.log(ingredients);
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-dark'>
          <div className='layout relative flex min-h-screen flex-col items-center space-y-4 py-12 text-white'>
            <h1>Recipe Generator</h1>
            <p className='text-sm text-gray-300'>
              Generate a recipe from a list of ingredients.
            </p>
            <form
              onSubmit={callGenerateEndpoint}
              className='w-full space-y-2 sm:w-2/3 md:w-1/2'
            >
              {allIngredients.map(({ title, items }) => {
                return (
                  <section
                    key={title}
                    className='rounded-xl border border-gray-500 p-2'
                  >
                    <h3>{title}</h3>
                    <div className='grid grid-cols-2 md:grid-cols-3'>
                      {items.map(({ id, name }) => {
                        return (
                          <div key={id} className='inline-block space-x-2'>
                            <input
                              type='checkbox'
                              id={id}
                              name={name}
                              value={name}
                              checked={ingredients.includes(name)}
                              onChange={onChange}
                            />
                            <label htmlFor={id}>{name}</label>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
              <div className='flex justify-center'>
                <Button
                  className=''
                  isLoading={isGenerating}
                  variant='outline'
                  isDarkBg={true}
                  type='submit'
                >
                  Generate
                </Button>
              </div>
            </form>

            {mounted && apiOutput && (
              <div className='mt-8'>
                <h3>Output</h3>
                <div className='mt-2 text-gray-300'>
                  {formatOutput(apiOutput)}
                </div>
              </div>
            )}

            <footer className='absolute bottom-2 text-gray-200'>
              © {new Date().getFullYear()}
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
