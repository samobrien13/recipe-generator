import { FormEvent, useEffect, useState } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

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
        return (
          <p key={key} className='py-2'>
            {item}
          </p>
        );
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
          <div className='layout relative flex min-h-screen flex-col items-center py-12 text-center text-white'>
            <h1 className='mt-4'>Recipe Generator</h1>
            <p className='mt-2 text-sm text-gray-300'>
              Generate a recipe from a list of ingredients.
            </p>
            <form onSubmit={callGenerateEndpoint}>
              <h2>Meat</h2>
              <div className='space-x-2'>
                <input
                  type='checkbox'
                  id='mince'
                  name='mince'
                  value='Mince'
                  onChange={onChange}
                />
                <label htmlFor='mince'>Mince</label>
                <input
                  type='checkbox'
                  id='steak'
                  name='steak'
                  value='Steak'
                  onChange={onChange}
                />
                <label htmlFor='steak'>Steak</label>
                <input
                  type='checkbox'
                  id='chickenBreast'
                  name='chickenBreast'
                  value='Chicken Breast'
                  onChange={onChange}
                />
                <label htmlFor='chickenBreast'>Chicken Breast</label>
              </div>
              <h2>Vegetables</h2>
              <div className='space-x-2'>
                <input
                  type='checkbox'
                  id='broccoli'
                  name='broccoli'
                  value='Broccoli'
                  onChange={onChange}
                />
                <label htmlFor='broccoli'>Broccoli</label>
                <input
                  type='checkbox'
                  id='capsicum'
                  name='capsicum'
                  value='Capsicum'
                  onChange={onChange}
                />
                <label htmlFor='capsicum'>Capsicum</label>
              </div>
              <h2>Staples</h2>
              <div className='space-x-2'>
                <input
                  type='checkbox'
                  id='rice'
                  name='rice'
                  value='Rice'
                  onChange={onChange}
                />
                <label htmlFor='rice'>Rice</label>
                <input
                  type='checkbox'
                  id='Pasta'
                  name='Pasta'
                  value='Pasta'
                  onChange={onChange}
                />
                <label htmlFor='capsicum'>Pasta</label>
              </div>
              <h2>Sauces</h2>
              <div className='space-x-2'>
                <input
                  type='checkbox'
                  id='hoisin'
                  name='hoisin'
                  value='Hoisin'
                  onChange={onChange}
                />
                <label htmlFor='hoisin'>Hoisin</label>
                <input
                  type='checkbox'
                  id='soy'
                  name='Soy'
                  value='Soy'
                  onChange={onChange}
                />
                <label htmlFor='soy'>Soy</label>
              </div>
              <h2>Dairy</h2>
              <div className='space-x-2'>
                <input
                  type='checkbox'
                  id='cheddar'
                  name='cheddar'
                  value='Cheddar'
                  onChange={onChange}
                />
                <label htmlFor='cheddar'>Cheddar</label>
                <input
                  type='checkbox'
                  id='cream'
                  name='cream'
                  value='Cream'
                  onChange={onChange}
                />
                <label htmlFor='cream'>Cream</label>
                <input
                  type='checkbox'
                  id='sourCream'
                  name='sourCream'
                  value='SourCream'
                  onChange={onChange}
                />
                <label htmlFor='sourCream'>SourCream</label>
              </div>
              <Button
                className='mt-4'
                isLoading={isGenerating}
                variant='outline'
                isDarkBg={true}
                type='submit'
              >
                Generate
              </Button>
            </form>

            {mounted && apiOutput && (
              <div className='mt-8'>
                <h2>Output</h2>
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
